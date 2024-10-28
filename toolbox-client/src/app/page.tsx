import { AvailableTools } from "@/lib/constants";
import { getUrl } from "@/lib/utils";
import { Icon } from '@iconify/react'
import Link from "next/link";

export default function Home() {
  return (
    <div className="container mx-auto px-4 md:px-16">
      {AvailableTools.map((it, index_i) => 
      <section key={`grp-${index_i}`} className="pt-8">
        <h3 className="pt-4 pb-2 text-xl font-medium">{it.group}</h3>
        <div className="px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-5">
            {it.tools.map((tool, index_j) =>
            <Link 
              key={`tool-${index_i}${index_j}`} 
              href={getUrl(tool.url, tool.action? [`a=${tool.action}`] : undefined)} 
              className="p-4 border dark:border-gray-600 rounded flex items-center w-full my-1 hover:bg-gray-50 dark:hover:bg-gray-700 hover:shadow dark:hover:shadow-gray-600"
            >
              <Icon icon={tool.icon} width={32} height={32} className="color-primary"/>
              <span className="ps-4 text-lg leading-5 tracking-wide">
                {tool.label}
              </span>
            </Link>
            )}
          </div>
        </div>
      </section>
      )}
    </div>
  )
}
