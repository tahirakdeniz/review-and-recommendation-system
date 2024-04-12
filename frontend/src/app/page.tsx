import FeaturedCarousel from '../components/Careousel/FeaturedCarousel';
import TopReviews from '../components/TopReviews';
import Recommendations from '../components/Recommendations';

export default function Home() {
    return (
        <div>
            <FeaturedCarousel/>
            <TopReviews/>
            <Recommendations/>
        </div>
    );
}
