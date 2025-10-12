import * as React from "react"
import { motion, HTMLMotionProps } from "framer-motion"
import { revealVariants } from "@/lib/animation-variants"
import { useReducedMotion } from "@/lib/use-reduced-motion"

import { cn } from "@/lib/utils"

interface CardProps extends React.ComponentProps<"div"> {
  animated?: boolean;
  animateOnScroll?: boolean;
  delay?: number;
}

function Card({ 
  className, 
  animated = false, 
  animateOnScroll = true, 
  delay = 0,
  ...props 
}: CardProps) {
  const prefersReducedMotion = useReducedMotion();

  if (!animated || prefersReducedMotion) {
    return (
      <div
        data-slot="card"
        className={cn(
          "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-lg",
          className
        )}
        {...props}
      />
    );
  }

  const variants = {
    ...revealVariants,
    visible: {
      ...revealVariants.visible,
      transition: {
        ...revealVariants.visible.transition,
        delay,
      }
    }
  };

  if (animateOnScroll) {
    return (
      <motion.div
        data-slot="card"
        variants={variants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className={cn(
          "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-lg",
          className
        )}
        {...(props as any)}
      />
    );
  }

  return (
    <motion.div
      data-slot="card"
      variants={variants}
      initial="hidden"
      animate="visible"
      className={cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-lg",
        className
      )}
      {...(props as any)}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("leading-none font-semibold", className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
