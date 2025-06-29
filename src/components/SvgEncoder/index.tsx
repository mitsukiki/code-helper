'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { encodeSvgForDataUri } from '@/lib/utils';

export default function SvgEncoder() {
  const [svgInput, setSvgInput] = useState('');
  const [encodedOutput, setEncodedOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [copiedExample, setCopiedExample] = useState(false);

  useEffect(() => {
    if (svgInput.trim()) {
      const encoded = encodeSvgForDataUri(svgInput);
      setEncodedOutput(encoded);
    } else {
      setEncodedOutput('');
    }
  }, [svgInput]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(encodedOutput);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const copyExampleToClipboard = async () => {
    try {
      const cssExample = `background-image: url("${encodedOutput}");`;
      await navigator.clipboard.writeText(cssExample);
      setCopiedExample(true);
      setTimeout(() => setCopiedExample(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const clearAll = () => {
    setSvgInput('');
    setEncodedOutput('');
    setCopied(false);
    setCopiedExample(false);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="svg-input" className="block text-sm font-medium mb-2">
              SVGコード入力
            </label>
            <textarea
              id="svg-input"
              className="w-full h-64 p-3 border border-input bg-background rounded-md font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="<svg xmlns=&quot;http://www.w3.org/2000/svg&quot; viewBox=&quot;0 0 24 24&quot;>
  <circle cx=&quot;12&quot; cy=&quot;12&quot; r=&quot;10&quot; fill=&quot;currentColor&quot; />
</svg>"
              value={svgInput}
              onChange={(e) => setSvgInput(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={clearAll}>
              クリア
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="encoded-output" className="block text-sm font-medium mb-2">
              エンコード結果
            </label>
            <div className="relative">
              <textarea
                id="encoded-output"
                className="w-full h-64 p-3 border border-input bg-muted rounded-md font-mono text-sm resize-none"
                readOnly
                value={encodedOutput}
                placeholder="エンコード結果がここに表示されます"
              />
              {encodedOutput && (
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute top-2 right-2"
                  onClick={copyToClipboard}
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      コピー済み
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" />
                      コピー
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {encodedOutput && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">使用例</CardTitle>
            <CardDescription>
              CSS background-imageプロパティでの使用方法
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <div className="bg-muted p-4 rounded-md font-mono text-sm">
                <div className="text-muted-foreground mb-2">CSS:</div>
                <div className="break-all">
                  background-image: url(&quot;{encodedOutput}&quot;);
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="absolute top-2 right-2"
                onClick={copyExampleToClipboard}
              >
                {copiedExample ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    コピー済み
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    コピー
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}