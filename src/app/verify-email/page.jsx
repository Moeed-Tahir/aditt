import SignUpVerifyEmail from '@/components/auth/SignUpVerifyEmail'
import { SignupSidebar } from '@/components/SignupSidebar'
import { SidebarProvider } from '@/components/ui/sidebar'
import React from 'react'

function page() {
  return (
    <SidebarProvider>
      <SignupSidebar />
      <SignUpVerifyEmail />
    </SidebarProvider>
  )
}

export default page
