import TabBar from "@/components/tab-bar";

export default function TabsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div >
            {children}
            <TabBar />
        </div>
    );
}