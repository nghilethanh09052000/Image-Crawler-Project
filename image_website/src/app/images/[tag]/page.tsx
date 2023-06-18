
export default function Page(
    { params }: { params: { tag: string } }) {
    return (
        <div>My Post: {params.tag}</div>
    )
}