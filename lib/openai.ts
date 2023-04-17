import { Configuration, FineTune, OpenAIApi } from "openai"
import FormData from 'form-data';

export type PromptInput = {
  prompt: string,
  completion: string
}

export type TrainingExample = {
  id: number
  name: string,
  data: PromptInput
}

export type FineTunedModel = {
  id: string,
  fullName: string
}

export type FineTunedModelResults = {
  succeeded: FineTunedModel[],
  loading: FineTunedModel[]
}


class CustomFormData extends FormData {
  getHeaders() {
      return {
      }
  }
}

export class OpenAIClient {
  private static instance: OpenAIClient;
  private apiKey: string;
  private openai: OpenAIApi;

  private constructor() {

  }

  public static getInstance(): OpenAIClient {
    if (!OpenAIClient.instance) {
      OpenAIClient.instance = new OpenAIClient();
    }

    return OpenAIClient.instance;
  }

  public setApiKey(apiKey: string): void {
    this.apiKey = apiKey;

    const configuration = new Configuration({
      apiKey: apiKey,
      formDataCtor: CustomFormData
    })
    
    const openai = new OpenAIApi(configuration);
    this.openai = openai
  }

  createCompletion = async (modelId : string, prompt : string) : Promise<string> => {
    try {
      const response = await this.openai.createCompletion({
        model: modelId,
        prompt: prompt,
        temperature: 0.7,
        max_tokens: 500,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });
    
      console.log(response)
    
      return response.data.choices[0].text || ""
    } catch (e) {
      alert("Error. Possible Invalid API Key - " + e.toString())
    }
  }

  uploadFileToOpenAI = async (fileName : string, trainingExamples : TrainingExample[]) : Promise<string | undefined> => {
    const promptInputs = trainingExamples.map(prompt => (prompt.data))
    
    const jsonlFileString = promptInputs.map((promptInput) => (JSON.stringify(promptInput))).join('\n')
  
    const file = new File([jsonlFileString], fileName + ".jsonl", { type: 'application/json' })
  
    const purpose = "fine-tune" // dont change this
  
    try {
      const response = await this.openai.createFile(file, purpose)
      return response.data.id
    } catch (e) {
      console.log(e)
      alert("Error. Possible Invalid API Key - " + e.toString())
      return undefined
    }
  }

  startTrainingFineTune = async (fileId : string, name : string) => {
    name = JSON.stringify(name).replace(/\s/g, '-')
  
    try {
      console.log("starting fine tune")
      const response = await this.openai.createFineTune({
        training_file: fileId,
        model: "davinci",
        suffix: name
      })
      console.log("finish fine tune")
      console.log(response)
      return response
    } catch (e) {
      console.log(e)
      throw(e)
    }
  }

  getFineTuneList = async () : Promise<FineTunedModelResults> => {
    try {
      const fineTunes = await this.openai.listFineTunes()
      console.log(fineTunes)
  
      const fineTunedSucceeded = fineTunes.data.data
        .filter((fineTune) => fineTune.status === "succeeded")
        .map((fineTune : FineTune) => {
          return {
            id: fineTune.id,
            fullName: fineTune.fine_tuned_model
          }
      })
  
      const fineTunedLoading = fineTunes.data.data
        .filter((fineTune) => fineTune.status !== "succeeded")
        .map((fineTune : FineTune) => {
          return {
            id: fineTune.id,
            fullName: "Model " + fineTune.id
          }
        })
  
      return {
        succeeded: fineTunedSucceeded,
        loading: fineTunedLoading
      }
    } catch (e) {
      console.log(e)
      return {
        succeeded: [],
        loading: []
      }
    }
  }
}

