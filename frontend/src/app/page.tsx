
import CardElement from '@/components/card/CardElement.component';
import MainLayout from '@/components/layout/MainLayout';
export default function Home() {
  return (
    <MainLayout>

      <section className='flex flex-wrap gap-9 '>

        <CardElement />
        <CardElement />
      </section>


    </MainLayout>

  )
}