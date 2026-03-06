import { useParams, Link } from 'react-router-dom';
import { usePost } from '@/hooks/usePosts';
import Navbar from '@/components/Navbar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft, Sparkles, Calendar } from 'lucide-react';
import { format } from 'date-fns';

export default function PostView() {
  const { id } = useParams<{ id: string }>();
  const { data: post, isLoading, error } = usePost(id!);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container max-w-3xl py-10">
        <Button variant="ghost" size="sm" asChild className="mb-8 text-muted-foreground hover:text-foreground">
          <Link to="/"><ArrowLeft className="mr-2 h-4 w-4" /> Back to posts</Link>
        </Button>

        {isLoading ? (
          <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : error ? (
          <p className="text-center text-destructive">Post not found or access denied.</p>
        ) : post ? (
          <article className="animate-fade-in">
            <header className="mb-10">
              <div className="mb-4 flex items-center gap-2">
                {post.ai_generated && (
                  <Badge variant="secondary" className="gap-1 text-primary">
                    <Sparkles className="h-3 w-3" /> AI Generated
                  </Badge>
                )}
                <Badge variant={post.published ? 'default' : 'outline'}>
                  {post.published ? 'Published' : 'Draft'}
                </Badge>
              </div>
              <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">{post.title}</h1>
              {post.excerpt && (
                <p className="mt-4 text-xl leading-relaxed text-muted-foreground">{post.excerpt}</p>
              )}
              <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <time>{format(new Date(post.created_at), 'MMMM d, yyyy')}</time>
              </div>
            </header>
            <div className="prose prose-lg max-w-none whitespace-pre-wrap leading-relaxed text-foreground">
              {post.content}
            </div>
          </article>
        ) : null}
      </main>
    </div>
  );
}
