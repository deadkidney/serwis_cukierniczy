
export default function Tags({
    tags
} : {
    tags: string[]
}) {

    if (tags.length == 0)
        return (<p>This recipe has no tags</p>);

    return(
        <section>
            <p>Tags:</p>
            {tags.map((tag) => {
                return <p key={tag}>{tag}</p>
            })}
        </section>
        
    );
}