import ForumCategoryPage from "@/components/ForumCategoryPage";

export default function ForumCategory({params: {categoryId}}: {params: {categoryId: string}}) {
    return (
        <ForumCategoryPage categoryId={categoryId}/>
    );
}