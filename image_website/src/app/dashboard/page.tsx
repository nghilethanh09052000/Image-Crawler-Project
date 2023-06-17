import { Suspense } from 'react'
 
export default function Posts() {
  return (
    <section>
      <Suspense fallback={<p>Loading feed...</p>}>
        <div>Welcome to Dashboard Page</div>
      </Suspense>
    </section>
  )
}