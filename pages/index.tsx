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
import Image from 'next/image'

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
      <Head>
        <title>Next.js</title>
        <meta
          name="description"
          content="Next.js template for building apps with Radix UI and Tailwind CSS"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <section className="container grid items-center gap-6 pt-6 pb-8 md:py-10">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-16">
          <div className="flex-1">
            <Image
              src={"/mockup.png"}
              alt="mockup"
              width={4096}
              height={2304}
              className="rounded-2xl w-full max-w-4xl"
            />
          </div>
          <div className="flex-1">
            <div className="flex flex-col items-start gap-2">
              <h1 className="text-3xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-5xl lg:text-6xl">
                TuneGPT <br className="hidden sm:inline" />
              </h1>
              <p className="text-lg text-slate-700 dark:text-slate-400 sm:text-xl mt-2">
                Train and run fine-tuned GPT models from the browser. The process of fine-tuning involves training a pre-existing model (such as GPT-3) on a new dataset or task, with only the final layers of the model being retrained while the preceding layers remain unchanged.
                Advantages of fine tuning a model include:
              </p>
              <ul className="ml-6 list-disc [&>li]:mt-2 text-slate-700 dark:text-slate-400 sm:text-xl">
                <li>No need for prompt engineering</li>
                <li>Higher quality results</li>
                <li>Cost savings due to shorter prompts</li>
                <li>Train on more examples</li>
                <li>Faster generations</li>
              </ul>
              <p className="text-lg text-slate-700 dark:text-slate-400 sm:text-xl mt-2">
                Add your your API key to get started
              </p>
              <div className="flex gap-4 mt-2">
                <Link
                  href={"/train"}
                  // target=""
                  rel="noreferrer"
                  className={buttonVariants({ size: "lg" })}
                >
                  Get Started
                </Link>
                <Link
                  target="_blank"
                  rel="noreferrer"
                  href={siteConfig.links.github}
                  className={buttonVariants({ variant: "outline", size: "lg" })}
                >
                  GitHub
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}

