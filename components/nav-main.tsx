"use client"

import { IconCirclePlusFilled, IconMail, type Icon } from "@tabler/icons-react"
import { motion } from "framer-motion"
import { navItemVariants, staggerContainer, staggerItem } from "@/lib/animation-variants"
import { useReducedMotion } from "@/lib/use-reduced-motion"

import { Button } from "@/components/ui/button"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: Icon
  }[]
}) {
  const prefersReducedMotion = useReducedMotion();

  const containerVariants = prefersReducedMotion 
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
    : staggerContainer;

  const itemVariants = prefersReducedMotion 
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
    : staggerItem;

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <SidebarMenu>
            {items.map((item, index) => (
              <motion.div key={item.title} variants={itemVariants}>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <motion.a 
                      href={item.url} 
                      className="text-[var(--primary)] hover:underline flex items-center gap-2"
                      variants={prefersReducedMotion ? {} : navItemVariants}
                      initial={prefersReducedMotion ? {} : "idle"}
                      whileHover={prefersReducedMotion ? {} : "hover"}
                      animate={prefersReducedMotion ? {} : "idle"}
                    >
                      {item.icon && <item.icon className="text-[var(--primary)]/80" />}
                      <span>{item.title}</span>
                    </motion.a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </motion.div>
            ))}
          </SidebarMenu>
        </motion.div>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
