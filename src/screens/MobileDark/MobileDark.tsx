import { SunIcon, XIcon } from "lucide-react";
import React from "react";
import { Button } from "../../components/ui/button";
import { Checkbox } from "../../components/ui/checkbox";
import { Input } from "../../components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs";

const todoItems = [
  {
    id: 1,
    text: "Complete online JavaScript course",
    completed: true,
  },
  {
    id: 2,
    text: "Jog around the park 3x",
    completed: false,
  },
  {
    id: 3,
    text: "10 minutes meditation",
    completed: false,
  },
  {
    id: 4,
    text: "Read for 1 hour",
    completed: false,
  },
  {
    id: 5,
    text: "Pick up groceries",
    completed: false,
  },
  {
    id: 6,
    text: "Complete Todo App on Frontend Mentor",
    completed: false,
  },
];

export const MobileDark = (): JSX.Element => {
  return (
    <div className="bg-[#171823] w-full min-w-[375px] min-h-[730px] relative">
      <img
        className="absolute top-0 left-0 w-[375px] h-[200px]"
        alt="Bitmap"
        src="/bitmap.png"
      />

      <header className="absolute top-12 left-6 w-[327px] flex items-center justify-between">
        <h1 className="[font-family:'Josefin_Sans',Helvetica] font-bold text-white text-[40px] tracking-[15px] leading-[normal]">
          TODO
        </h1>
        <Button variant="ghost" size="icon" className="h-auto w-auto p-0">
          <SunIcon className="w-5 h-5 text-white" />
        </Button>
      </header>

      <div className="absolute top-[108px] left-6 w-[327px]">
        <div className="bg-[#25273d] rounded-[5px] shadow-[0px_35px_50px_-15px_#00000080] p-5">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-[10px] border border-solid border-[#393a4b]" />
            <Input
              placeholder="Create a new todo…"
              className="border-0 bg-transparent [font-family:'Josefin_Sans',Helvetica] font-normal text-[#767992] text-xs tracking-[-0.17px] p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
        </div>
      </div>

      <main className="absolute top-[172px] left-6 w-[327px]">
        <div className="bg-[#25273d] rounded-[5px] shadow-[0px_35px_50px_-15px_#00000080]">
          <ul className="divide-y divide-[#393a4b]">
            {todoItems.map((item, index) => (
              <li
                key={item.id}
                className="flex items-center justify-between p-5"
              >
                <div className="flex items-center gap-3 flex-1">
                  <Checkbox
                    checked={item.completed}
                    className="w-5 h-5 rounded-[10px] border-[#393a4b] data-[state=checked]:bg-gradient-to-br data-[state=checked]:from-[#55ddff] data-[state=checked]:to-[#c058f3] data-[state=checked]:border-0"
                  />
                  <span
                    className={`[font-family:'Josefin_Sans',Helvetica] font-normal text-xs tracking-[-0.17px] leading-[normal] ${
                      item.completed
                        ? "text-[#4d5067] line-through"
                        : "text-[#c8cbe7]"
                    }`}
                  >
                    {item.text}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-auto w-auto p-0"
                >
                  <XIcon className="w-3 h-3 text-[#5b5e7e]" />
                </Button>
              </li>
            ))}
          </ul>

          <div className="flex items-center justify-between px-5 py-4 border-t border-[#393a4b]">
            <span className="[font-family:'Josefin_Sans',Helvetica] font-normal text-[#5b5e7e] text-xs tracking-[-0.17px] leading-[normal]">
              5 items left
            </span>
            <Button
              variant="ghost"
              className="h-auto p-0 [font-family:'Josefin_Sans',Helvetica] font-normal text-[#5b5e7e] text-xs tracking-[-0.17px] leading-[normal] hover:bg-transparent hover:text-[#c8cbe7]"
            >
              Clear Completed
            </Button>
          </div>
        </div>
      </main>

      <div className="absolute top-[556px] left-6 w-[327px]">
        <div className="bg-[#25273d] rounded-[5px] shadow-[0px_35px_50px_-15px_#00000080] p-[15px]">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="w-full bg-transparent h-auto p-0 gap-[22px] justify-center">
              <TabsTrigger
                value="all"
                className="[font-family:'Josefin_Sans',Helvetica] font-bold text-sm tracking-[-0.19px] leading-[normal] data-[state=active]:text-[#397cfc] data-[state=inactive]:text-[#5b5e7e] bg-transparent p-0 h-auto data-[state=active]:shadow-none hover:text-[#c8cbe7]"
              >
                All
              </TabsTrigger>
              <TabsTrigger
                value="active"
                className="[font-family:'Josefin_Sans',Helvetica] font-bold text-sm tracking-[-0.19px] leading-[normal] data-[state=active]:text-[#397cfc] data-[state=inactive]:text-[#5b5e7e] bg-transparent p-0 h-auto data-[state=active]:shadow-none hover:text-[#c8cbe7]"
              >
                Active
              </TabsTrigger>
              <TabsTrigger
                value="completed"
                className="[font-family:'Josefin_Sans',Helvetica] font-bold text-sm tracking-[-0.19px] leading-[normal] data-[state=active]:text-[#397cfc] data-[state=inactive]:text-[#5b5e7e] bg-transparent p-0 h-auto data-[state=active]:shadow-none hover:text-[#c8cbe7]"
              >
                Completed
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <footer className="absolute top-[644px] left-6 w-[327px]">
        <p className="[font-family:'Josefin_Sans',Helvetica] font-normal text-[#5b5e7e] text-sm text-center tracking-[-0.19px] leading-[normal]">
          Drag and drop to reorder list
        </p>
      </footer>
    </div>
  );
};
