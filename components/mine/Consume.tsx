import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "../ui/textarea"
import { useEffect, useState } from "react"
import { FineTunedModel, OpenAIClient } from "@/lib/openai"
import DynamicTextarea from "../ui/dynamictextarea"

const openai = OpenAIClient.getInstance()

export default function Consume() {

  const [fineTunes, setFineTunes] = useState<FineTunedModel[]>([])
  const [fineTunesLoading, setFineTunesLoading] = useState<FineTunedModel[]>([])
  const [modelId, setModelId] = useState("")
  const [prompt, setPrompt] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const init = async () => {
      const fineTuneListResult = await openai.getFineTuneList()
      setFineTunes(fineTuneListResult.succeeded)
      setFineTunesLoading(fineTuneListResult.loading)
    }
    init()
  }, [])

  const onPressGenerate = async () => {
    setIsLoading(true)
    const result = await openai.createCompletion(modelId, prompt)
    setPrompt(prompt + "\n\n--\n\n" + result)
    setIsLoading(false)
  }

  return (
    <div className="grid gap-4">
      {/* <p className="text-sm text-slate-500 dark:text-slate-400">
        Use one of your OpenAI fine-tuned models to perform a completion 
      </p> */}

      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="email-2">Select a Model</Label>
        <p className="text-sm text-slate-500">Newly created models may take up to 12 hours to complete training.</p>
        <div className="flex flex-row">
          <div className="mr-2 flex-1">
            <Select onValueChange={(value) => {setModelId(value)}}>
              <SelectTrigger className="w-full" >
                <SelectValue className="text-red-400" placeholder=""/>
              </SelectTrigger>
              <SelectContent>
              <SelectGroup>
                  <SelectLabel>Premade Models</SelectLabel>
                  <SelectItem value="text-davinci-003">text-davinci-003</SelectItem>
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel>Your Models</SelectLabel>
                  {
                    fineTunes.map(fineTune => (
                      <SelectItem value={fineTune.fullName}>{fineTune.fullName}</SelectItem>
                    ))
                  }
                </SelectGroup>
                <SelectGroup>
                  {
                    fineTunesLoading.length !== 0 && 
                    <>
                      <SelectLabel>Loading</SelectLabel>
                      {
                        fineTunesLoading.map(fineTune => (
                          <SelectItem disabled value={fineTune.fullName}>{fineTune.fullName}</SelectItem>
                        ))
                      }
                    </>
                  }
                </SelectGroup>
                <SelectSeparator />
              </SelectContent>
            </Select>
          </div>

          {/* <div className="">
            <Button variant="subtle" className="">+ New Model</Button>
          </div> */}
        </div>
      </div>

      <div className="grid w-full gap-2">
        <div className="grid w-full gap-1.5">
          <Label htmlFor="message">Your Prompt</Label>
          <DynamicTextarea placeholder="Type your prompt here" id="message" value={prompt} onChange={(e) => {setPrompt(e.target.value)}}/>
        </div>

      </div>

      {
        !isLoading &&
        <Button onClick={onPressGenerate}>Generate Completion</Button>
      }

      {
        isLoading &&
        <Button onClick={() => {}} className="p-2 mr-3" disabled>
          <div className="spinner-container">
            <div className="spinner"></div>
          </div>
        </Button>
      }
    </div>
  )
}