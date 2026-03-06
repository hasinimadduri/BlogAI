import { usePublicPosts } from '@/hooks/usePosts';
import Navbar from '@/components/Navbar';
import PostCard from '@/components/PostCard';
import { Loader2, PenLine, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function Index() {
  const { data: posts, isLoading } = usePublicPosts();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden border-b bg-card">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.08),transparent_60%)]" />
        <div className="container relative py-24 text-center">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/20">
            <PenLine className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl">
            Blog<span className="text-primary">AI</span>
          </h1>
          <p className="mx-auto mt-4 max-w-md text-lg leading-relaxed text-muted-foreground">
            Create, manage, and publish blog posts with AI-powered content generation.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Button size="lg" asChild className="shadow-lg shadow-primary/20">
              <Link to="/auth">
                <Sparkles className="mr-2 h-4 w-4" /> Get Started
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="#posts">Browse Posts</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <main id="posts" className="container py-16">
        <div className="mb-10">
          <h2 className="text-2xl font-bold tracking-tight">Recent Posts</h2>
          <p className="mt-1 text-muted-foreground">Discover the latest articles from our community</p>
        </div>
        {isLoading ? (
          <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : !posts?.length ? (
          <div className="rounded-xl border-2 border-dashed py-20 text-center">
            <p className="text-muted-foreground">No published posts yet. Be the first to write one!</p>
            <Button className="mt-4" asChild>
              <Link to="/auth">Create a Post</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} BlogAI. Built with AI-powered content generation.
        </div>
      </footer>
    </div>
  );
}
