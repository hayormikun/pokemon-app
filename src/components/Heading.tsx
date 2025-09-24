type Props = {
    heading: string 
}

export const Heading = ({heading}: Props) => {
  return (
    <h1 className='text-center uppercase font-bold text-5xl mb-5 text-amber-500'>{heading}</h1>
  )
}