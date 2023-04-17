import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useEffect, useRef, useState } from "react"
import { Separator } from "../ui/separator"
import { parse } from 'papaparse';
import { TrainingExample, PromptInput, OpenAIClient } from "@/lib/openai"
import { Check, Trash2 } from "lucide-react"
import { wait } from "@/lib/utils"
import DynamicTextarea from "../ui/dynamictextarea"

const openai = OpenAIClient.getInstance()

export default function Create() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const leftSideRef = useRef<HTMLDivElement>(null);
  const rightSideRef = useRef<HTMLDivElement>(null);
  const [statusMessage, setStatusMessage] = useState("")
  const [name, setName] = useState("")
  const [inputs, setInputs] = useState<TrainingExample[]>([{
    id: 1,
    name: "Input 1",
    data: {
      prompt: "",
      completion: ""
    }
  }])

  const [selectedInputId, setSelectedInputId] = useState(1)
  const selectedInputIndex = inputs.findIndex((input) => (input.id === selectedInputId))
  const selectedInput = inputs[selectedInputIndex]
  var id = useRef(1)

  const statusMessageDone = "Job submitted. OpenAI may take up to 12 hours to process the data"
  const isLoading = statusMessage !== "" && statusMessage !== statusMessageDone

  useEffect(() => {
    console.log("hey", rightSideRef.current.clientHeight)
    if (leftSideRef.current && rightSideRef.current) {
      leftSideRef.current.style.height = rightSideRef.current.clientHeight + "px"
    }
  }, [inputs, selectedInputId])


  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const csvFile = event.target.files?.[0];

    if (!csvFile) {
      return;
    }

    const csvString = await csvFile.text()
    const parsedCsv = await parse(csvString, { header: true });

    const requiredColumns = ['prompt', 'completion'];
    if (!parsedCsv.meta.fields?.every(field => requiredColumns.includes(field))) {
      alert(`CSV file must contain headers for ${requiredColumns.join(', ')}`);
      return
    }
    
    const parsedInputs: PromptInput[] = parsedCsv.data.map((row: { prompt: string, completion: string }) => ({
      prompt: row.prompt,
      completion: row.completion
    }));
    
    const newInputs = parsedInputs.map((inputData, index) => {
      return {
        id: getId(),
        name: "Input " + (index + 1),
        data: inputData
      }
    })

    setInputs(newInputs.reverse())
    setSelectedInputId(newInputs[0].id)

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  const onChangePrompt = (newPrompt : string) => {
    const newInputs = [...inputs]
    newInputs[selectedInputIndex].data.prompt = newPrompt
    setInputs(newInputs)
  }

  const onChangeCompletion = (newCompletion : string) => {
    const newInputs = [...inputs]
    newInputs[selectedInputIndex].data.completion = newCompletion
    setInputs(newInputs)
  }

  const canPressNext = () => {
    return selectedInputIndex < inputs.length - 1
  }

  const canPressBack = () => {
    return selectedInputIndex > 0
  }

  const onPressNext = () => {
    if (canPressNext()) {
      setSelectedInputId(inputs[selectedInputIndex + 1].id)
    }
  }

  const onPressBack = () => {
    if (canPressBack()) {
      setSelectedInputId(inputs[selectedInputIndex - 1].id)
    }
  }

  const onPressDelete = () => {
    const newInputs = inputs.filter((input) => input.id != selectedInputId)
    if (newInputs.length != 0) {
      setInputs(newInputs)
      setSelectedInputId(selectedInputIndex === newInputs.length ? newInputs[newInputs.length - 1].id : newInputs[selectedInputIndex].id)
    }
  }


  const onPressNewInput = () => {
    const id = getId()

    const newInput = {
      id: id,
      name: "Input " + id,
      data: {
        prompt: "",
        completion: ""
      }
    }

    setInputs([newInput, ...inputs])
    setSelectedInputId(id)
  }

  const onPressSubmit = async () => {
    setStatusMessage("Uploading data to OpenAI")
    const fileIdAwait = openai.uploadFileToOpenAI("shreytest2", inputs)
    await wait(1200)
    const fileId = await fileIdAwait
    
    if (fileId) {
      setStatusMessage("Starting Fine Tune Job")
      const fineTuneAwait = openai.startTrainingFineTune(fileId, name || "untitled")
      await wait(1000)
      const fineTune = await fineTuneAwait
      setStatusMessage(statusMessageDone)
    } else {
      setStatusMessage("")
    }
  }

  const getId = () : number => {
    id.current += 1
    return id.current
  }

  return (
    <div>
      <p className="text-sm text-slate-500 dark:text-slate-400">
        GPT-3 has been pre-trained on a vast amount of text from the open internet. When given a prompt with just a few examples, it can often intuit what task you are trying to perform and generate a plausible completion. This is often called "few-shot learning."
        Fine-tuning improves on few-shot learning by training on many more examples than can fit in the prompt, letting you achieve better results on a wide number of tasks. Once a model has been fine-tuned, you won't need to provide examples in the prompt anymore. This saves costs and enables lower-latency requests.
      </p>
      <div className="grid gap-2 py-4">
        <div className="space-y-1">
          <Label htmlFor="name">Model Name</Label>
          <Input id="name" placeholder="Fine Tuned Email Writing Bot" value={name} onChange={(e) => {setName(e.target.value)}}/>
        </div>

        <div className="space-y-1">
          
        </div>
        <div>
          <Label>Training Data - </Label>
          <Button variant="link" onClick={handleButtonClick} className="inline w-auto items-start py-0 px-0 font-bold h-5 text-indigo-500 dark:text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-300 hover:underline focus:outline-none focus:text-indigo-600 dark:focus:text-indigo-300">Upload CSV</Button>
          <input type="file" accept=".csv" onChange={handleFileUpload} ref={fileInputRef} className="hidden"/>
        </div>
        <p className="inline text-sm text-slate-500 mt-0">CSV should have two columns: "prompt" and "completion" </p>
        
        <div className=" gap-4 border-slate-300 dark:border-slate-700 border-2 rounded-md p-4" style={{ display: 'grid', gridTemplateColumns: 'auto auto 1fr' }}>
          <div className="flex flex-col" ref={leftSideRef}>
            <div className="overflow-scroll flex-1">
              <div className={"py-2 pl-4 pr-5 mb-1 rounded-md cursor-pointer select-none bg-indigo-500 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500"} onClick={() => {onPressNewInput()}}>
                <p className="text-sm font-medium leading-none block text-start text-white dark:text-gray-200">+ New Input</p>
              </div>

              {
                inputs.map((input) => (
                  <div className={"py-2 px-2 hover:bg-slate-300 dark:hover:bg-slate-600 rounded-md cursor-pointer select-none " + (selectedInputId === input.id ? "bg-slate-200 dark:bg-slate-700" : "")} onClick={() => {setSelectedInputId(input.id)}}>
                    <p className="text-sm font-medium leading-none block text-start">{input.name}</p>
                  </div>
                ))
              }
            </div>
          </div>

          <Separator orientation="vertical" />

          <div className="flex-1">
            <div ref={rightSideRef}>
              <div className="grid gap-2">
                <div className="space-y-1">
                  <Label htmlFor="prompt">Prompt</Label>
                  <DynamicTextarea id="prompt" value={selectedInput?.data.prompt} onChange={(e) => {onChangePrompt(e.target.value)}} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="completion">Completion</Label>
                  <span>
                  <DynamicTextarea id="completion" value={selectedInput?.data.completion} onChange={(e) => {onChangeCompletion(e.target.value)}} />
                  </span>
                </div>
              </div>
              <div className="mt-4 flex flex-row">
                  <Button className="mr-2 p-2 " onClick={onPressDelete} variant="destructive">
                    <Trash2 className="h-6 w-6" />
                  </Button>
                  <div className="flex-1"></div>
                  <Button className="mr-2" onClick={onPressBack}>Back</Button>
                  <Button onClick={onPressNext}>Next</Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {
          statusMessage === "" &&
          <Button onClick={() => {onPressSubmit()}}>Create Fine Tune</Button>
        }
        {
          statusMessage !== "" && statusMessage !== statusMessageDone && 
          <div className="flex flex-row items-center">
            <Button onClick={() => {}} className="p-2 mr-3" disabled>
              <div className="spinner-container">
                <div className="spinner"></div>
              </div>
            </Button>
            <p className="text-slate-500 dark:text-slate-400">
              {statusMessage}
            </p>
          </div>
        }
        {
          statusMessage === statusMessageDone &&
          <div className="flex flex-row items-center">
            <Button onClick={() => {onPressSubmit()}} className="p-2 mr-3 bg-green-500 dark:bg-green-500 text-green-50 dark:text-green-50"><Check/></Button>
            <p className="text-slate-500 dark:text-slate-400">
              {statusMessage}
            </p>
          </div>
        }

      </div>
    </div>
  )
}