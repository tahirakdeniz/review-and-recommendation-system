'use client'
import {Card, Layout} from "antd";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {StyleProvider} from '@ant-design/cssinjs';

export function ProjectLayout(props: { children: React.ReactNode }) {
    return (
        // <StyleProvider hashPriority={"high"}>
            <Layout  className={'h-screen'}>
                <Layout.Header>
                    <div className={'container mx-auto'}>
                        <Navbar/>
                    </div>
                </Layout.Header>
                <Layout.Content className={'px-12 mt'}>
                    <div className={'container mx-auto'}>
                        {props.children}
                    </div>
                </Layout.Content>
                <Layout.Footer>
                    <div className={'container mx-auto'}>
                        <Footer/>
                    </div>
                </Layout.Footer>
            </Layout>
        // </StyleProvider>
    );
}