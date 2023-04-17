import Head from "next/head"
import Link from "next/link"

import { siteConfig } from "@/config/site"
import { Layout } from "@/components/layout"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Create from "@/components/mine/Create"
import Consume from "@/components/mine/Consume"
import { OpenAIClient } from "@/lib/openai"

const openai = OpenAIClient.getInstance()

export default function IndexPage() {
  const [position, setPosition] = useState("bottom")
  const [apiKey, setApiKey] = useState("")

  function onChangeApiKey(value: string) {
    openai.setApiKey(value)
    setApiKey(value)
  }

  return (
    <Layout>
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
          apiKey &&
          <>
            <Tabs defaultValue="account" className="pb-96">
              <TabsList>
                <TabsTrigger value="account">Create</TabsTrigger>
                <TabsTrigger value="password">Consume</TabsTrigger>
              </TabsList>
              <TabsContent value="account">
                <Create />
              </TabsContent>
              <TabsContent value="password">
                <Consume />
              </TabsContent>
            </Tabs>
          </>
        }
      </section>
    </Layout>
  )
}
