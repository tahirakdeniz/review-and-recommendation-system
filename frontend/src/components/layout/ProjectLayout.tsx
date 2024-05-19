'use client'
import {Card, Layout} from "antd";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";


export function ProjectLayout(props: { children: React.ReactNode }) {
    return (
        // <StyleProvider hashPriority={"high"}>
            <Layout  className={'h-screen'}>
                <Layout.Header className={'bg-white'}>
                    <Navbar/>
                </Layout.Header>
                <Layout.Content className={'px-12 mt-4'}>
                    <div className={'container mx-auto'}>
                        {props.children}
                    </div>
                </Layout.Content>
                {/*<Layout.Footer>*/}
                {/*    <div className={'container mx-auto'}>*/}
                {/*        <Footer/>*/}
                {/*    </div>*/}
                {/*</Layout.Footer>*/}
            </Layout>
        // </StyleProvider>
    );
}