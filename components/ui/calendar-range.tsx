"use client"

import * as React from "react"
import { Calendar } from "@/components/ui/calendar"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { DateRange } from "react-day-picker"

interface CalendarRangeProps {
  onDateChange?: (range: { from: Date; to: Date }) => void;
  className?: string;
  defaultRange?: { from: Date; to: Date };
}

export function CalendarRange({ onDateChange, className, defaultRange }: CalendarRangeProps) {
  const today = new Date()
  const maxPastDate = new Date()
  maxPastDate.setDate(today.getDate() - 30)

  // Standard-Range: letzte 7 Tage
  const defaultFrom = new Date()
  defaultFrom.setDate(today.getDate() - 7)

  const [range, setRange] = React.useState<DateRange | undefined>(
    defaultRange || { from: defaultFrom, to: today }
  )
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    if (defaultRange) {
      setRange(defaultRange)
    }
  }, [defaultRange])

  const handleSelect = (selected: DateRange | undefined) => {
    setRange(selected)
    if (selected?.from && selected?.to && onDateChange) {
      onDateChange({ from: selected.from, to: selected.to })
    }
  }

  const formatDateRange = () => {
    if (range?.from && range?.to) {
      const fromStr = range.from.toLocaleDateString('de-DE', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric' 
      })
      const toStr = range.to.toLocaleDateString('de-DE', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric' 
      })
      return `${fromStr} – ${toStr}`
    }
    return "Zeitraum wählen"
  }

  return (
    <div className={cn("relative w-fit", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-[280px] justify-start text-left font-normal",
              !range && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {formatDateRange()}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={range?.from}
            selected={range}
            onSelect={handleSelect}
            numberOfMonths={2}
            disabled={(date) =>
              date > today || date < maxPastDate
            }
            className="p-3"
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
