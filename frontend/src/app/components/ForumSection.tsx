import ForumSectionCategory from "@/components/ForumSectionCategory";

export function ForumSection() {
    const categories = [
        {title: "Discussion", subcategories: [{title: "General", topicCount: 10, postCount: 100}, {title: "Off-Topic", topicCount: 5, postCount: 50}]},
        {title: "Help", subcategories: [{title: "General", topicCount: 10, postCount: 100}, {title: "Off-Topic", topicCount: 5, postCount: 50}]},
    ];
    return (
        <>
            {categories.map(category => (
                <ForumSectionCategory title={category.title} subcategories={category.subcategories} />
            ))}
        </>
    );
}