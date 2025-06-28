'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { calculateClamp, ClampCalculatorInputs } from '@/lib/clampCalculator';
import { useLocalStorage } from '@/hooks/useLocalStorage';

export default function ClampCalculator() {
  const [unit, setUnit] = useLocalStorage<'px' | 'rem'>('clamp-unit-preference', 'rem');
  const [inputs, setInputs] = useState<ClampCalculatorInputs>({
    minValue: 1,
    maxValue: 1.5,
    minViewport: 375,
    maxViewport: 1200,
    unit: unit
  });
  const [copied, setCopied] = useState(false);

  const handleInputChange = (field: keyof ClampCalculatorInputs, value: string) => {
    const numValue = parseFloat(value) || 0;
    setInputs(prev => ({
      ...prev,
      [field]: numValue
    }));
  };

  const handleUnitChange = (newUnit: 'px' | 'rem') => {
    setUnit(newUnit);
    setInputs(prev => ({
      ...prev,
      unit: newUnit
    }));
  };

  const result = calculateClamp(inputs);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(result.clampValue);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>CSS clamp自動計算</CardTitle>
        <CardDescription>
          レスポンシブなフォントサイズやスペーシングを計算します
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="unit">単位</Label>
              <Select value={unit} onValueChange={handleUnitChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rem">rem</SelectItem>
                  <SelectItem value="px">px</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="minValue">最小値</Label>
                <Input
                  id="minValue"
                  type="number"
                  step="0.1"
                  value={inputs.minValue}
                  onChange={(e) => handleInputChange('minValue', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="maxValue">最大値</Label>
                <Input
                  id="maxValue"
                  type="number"
                  step="0.1"
                  value={inputs.maxValue}
                  onChange={(e) => handleInputChange('maxValue', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="minViewport">最小ビューポート (px)</Label>
                <Input
                  id="minViewport"
                  type="number"
                  value={inputs.minViewport}
                  onChange={(e) => handleInputChange('minViewport', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="maxViewport">最大ビューポート (px)</Label>
                <Input
                  id="maxViewport"
                  type="number"
                  value={inputs.maxViewport}
                  onChange={(e) => handleInputChange('maxViewport', e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label>計算結果</Label>
              <div className="relative">
                <div className="bg-muted p-4 rounded-md font-mono text-sm break-all">
                  {result.clampValue}
                </div>
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
              </div>
            </div>

            <div className="text-sm text-muted-foreground space-y-2">
              <div>
                <strong>計算詳細:</strong>
              </div>
              <div>傾き: {result.slope.toFixed(3)}</div>
              <div>y切片: {result.yIntercept.toFixed(3)}{unit}</div>
              <div className="text-xs mt-3">
                <strong>計算式:</strong><br />
                slope = (max_value - min_value) / (max_viewport - min_viewport)<br />
                y_intercept = min_value - slope * min_viewport
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}