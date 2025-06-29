import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ClampCalculator from "@/components/ClampCalculator";
import SvgEncoder from "@/components/SvgEncoder";
import ImageConverter from "@/components/ImageConverter";

export default function Home() {
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto">
        <header className="text-center py-8">
          <h1 className="text-4xl font-bold">開発者向けツール統合サイト</h1>
        </header>

        <Tabs defaultValue="clamp" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="clamp">CSS clamp計算</TabsTrigger>
            <TabsTrigger value="svg">SVG エンコード</TabsTrigger>
            <TabsTrigger value="image">画像変換</TabsTrigger>
          </TabsList>

          <TabsContent value="clamp" className="mt-6">
            <ClampCalculator />
          </TabsContent>

          <TabsContent value="svg" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>SVG URLエンコード</CardTitle>
                <CardDescription>
                  SVGをCSS background-image用のdata URIに変換します
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SvgEncoder />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="image" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>画像変換 (PNG/JPG → WebP)</CardTitle>
                <CardDescription>
                  画像をWebP形式に変換してファイルサイズを最適化します
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ImageConverter />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}