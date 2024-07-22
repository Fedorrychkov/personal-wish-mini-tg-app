import { ReactNode } from 'react'

type Props = {
  content?: ReactNode
  text?: string
  selector?: string
  onNext?: (currentSelector?: string) => void
}

export const OnboardingStep = (props: Props) => {
  const { text, content } = props

  return (
    <div>
      {text && <p className="text-sm font-bold text-slate-900 dark:text-slate-200">{text}</p>}
      {content}
    </div>
  )
}
