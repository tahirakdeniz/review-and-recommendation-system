import ForumTopicPage from "@/components/ForumTopicPage";

export default function ForumCategory({params: {topicId}}: {params: {topicId: string}}) {
    return (
        <ForumTopicPage topicId={topicId}/>
    );
}