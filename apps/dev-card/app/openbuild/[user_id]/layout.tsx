import { CardSeoContent, createCardMetadata } from "@/lib/cardSeo"

interface LayoutProps {
  children: React.ReactNode
  params: Promise<{ user_id: string }>
}

export async function generateMetadata({ params }: Pick<LayoutProps, "params">) {
  const { user_id } = await params
  return createCardMetadata("openbuild", "OpenBuild", user_id)
}

export default async function CardLayout({ children, params }: LayoutProps) {
  const { user_id } = await params
  return <><CardSeoContent ecosystem="openbuild" label="OpenBuild" userId={user_id} />{children}</>
}
