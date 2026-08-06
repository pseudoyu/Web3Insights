import { CardSeoContent, createCardMetadata } from "@/lib/cardSeo"

interface LayoutProps {
  children: React.ReactNode
  params: Promise<{ user_id: string }>
}

export async function generateMetadata({ params }: Pick<LayoutProps, "params">) {
  const { user_id } = await params
  return createCardMetadata("monad", "Monad", user_id)
}

export default async function CardLayout({ children, params }: LayoutProps) {
  const { user_id } = await params
  return <><CardSeoContent ecosystem="monad" label="Monad" userId={user_id} />{children}</>
}
