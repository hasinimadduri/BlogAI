import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Sparkles, Save } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Props {
  initialData?: { title: string; content: string; excerpt: string; published: boolean };
  onSave: (data: { title: string; content: string; excerpt: string; published: boolean; ai_generated?: boolean }) => void;
  saving?: boolean;
}

export default function PostEditor({ initialData, onSave, saving }: Props) {
  const [title, setTitle] = useState(initialData?.title ?? '');
  const [content, setContent] = useState(initialData?.content ?? '');
  const [excerpt, setExcerpt] = useState(initialData?.excerpt ?? '');
  const [published, setPublished] = useState(initialData?.published ?? false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const { toast } = useToast();

  const generateWithAI = async () => {
    if (!aiPrompt.trim()) return;
    setAiLoading(true);
    try {
      const res = await supabase.functions.invoke('generate-blog', {
        body: { prompt: aiPrompt },
      });
      if (res.error) throw new Error(res.error.message);
      const data = res.data;
      if (data.title) setTitle(data.title);
      if (data.content) setContent(data.content);
      if (data.excerpt) setExcerpt(data.excerpt);
      toast({ title: 'AI content generated!', description: 'Review and edit the generated content below.' });
    } catch (e: any) {
      toast({ title: 'AI generation failed', description: e.message, variant: 'destructive' });
    }
    setAiLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({ title, content, excerpt, published });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* AI Generator */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            AI Content Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input
            placeholder="Describe the blog post you want to generate..."
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            className="bg-card"
          />
          <Button
            type="button"
            onClick={generateWithAI}
            disabled={aiLoading || !aiPrompt.trim()}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {aiLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            Generate with AI
          </Button>
        </CardContent>
      </Card>

      {/* Post Fields */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title" className="text-sm font-medium">Title</Label>
          <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Post title" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="excerpt" className="text-sm font-medium">Excerpt</Label>
          <Input id="excerpt" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="Short summary" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="content" className="text-sm font-medium">Content</Label>
          <Textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} placeholder="Write your blog post..." className="min-h-[300px] leading-relaxed" />
        </div>
        <div className="flex items-center gap-3">
          <Switch id="published" checked={published} onCheckedChange={setPublished} />
          <Label htmlFor="published" className="text-sm">Publish immediately</Label>
        </div>
      </div>

      <Button type="submit" disabled={saving || !title.trim()} className="w-full sm:w-auto">
        {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
        {initialData ? 'Update Post' : 'Create Post'}
      </Button>
    </form>
  );
}
