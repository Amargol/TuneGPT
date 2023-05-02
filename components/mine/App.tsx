import Head from "next/head"

import { Layout } from "@/components/layout"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Create from "@/components/mine/Create"
import Consume from "@/components/mine/Consume"
import { OpenAIClient } from "@/lib/openai"

const openai = OpenAIClient.getInstance()

interface Props {
  defaultTab: "train" | "run";
}

export default function App({ defaultTab } : Props) {
  const [position, setPosition] = useState("bottom")
  const [apiKey, setApiKey] = useState("")

  function onChangeApiKey(value: string) {
    openai.setApiKey(value)
    setApiKey(value)
  }

  return (
    <Layout>
      <Head>
        <title>TuneGPT</title>
        <meta
          name="TuneGPT"
          content="Train and run fine tuned GPT models in the browser"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <section className="container grid items-center gap-6 pt-6 pb-8 md:py-10">
        {/* <div className="flex max-w-[980px] flex-col items-start gap-2"> */}

        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="email-2">OpenAI API Key</Label>
          <div className="flex w-full items-center space-x-2">
            <Input type="password" id="" placeholder="sk-kXI15Wcogz8RCXKmpPjWn27pV45kC0nT" className="flex-1" onChange={(e) => {onChangeApiKey(e.target.value)}}/>
            <Button type="submit" variant="subtle">Get Started</Button>
          </div>
          <p className="text-sm text-slate-500">This will only be used locally</p>
        </div>

        {
          true &&
          <>
            <Tabs defaultValue={defaultTab} className="pb-96">
              <TabsList>
                <TabsTrigger value="train">Train</TabsTrigger>
                <TabsTrigger value="run">Run</TabsTrigger>
              </TabsList>
              <TabsContent value="train">
                <Create />
              </TabsContent>
              <TabsContent value="run">
                <Consume />
              </TabsContent>
            </Tabs>
          </>
        }
      </section>
    </Layout>
  )
}
