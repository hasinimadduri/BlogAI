import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { useMyPosts, useCreatePost, useUpdatePost, useDeletePost, Post } from '@/hooks/usePosts';
import Navbar from '@/components/Navbar';
import PostCard from '@/components/PostCard';
import PostEditor from '@/components/PostEditor';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader2, Plus, FileText } from 'lucide-react';

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const { data: posts, isLoading } = useMyPosts();
  const createPost = useCreatePost();
  const updatePost = useUpdatePost();
  const deletePost = useDeletePost();
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);

  if (authLoading) return <div className="flex min-h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  if (!user) return <Navigate to="/auth" replace />;

  const handleSave = (data: { title: string; content: string; excerpt: string; published: boolean; ai_generated?: boolean }) => {
    if (editingPost) {
      updatePost.mutate({ id: editingPost.id, ...data }, { onSuccess: () => { setEditorOpen(false); setEditingPost(null); } });
    } else {
      createPost.mutate(data, { onSuccess: () => { setEditorOpen(false); } });
    }
  };

  const openCreate = () => { setEditingPost(null); setEditorOpen(true); };
  const openEdit = (post: Post) => { setEditingPost(post); setEditorOpen(true); };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-10">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Posts</h1>
            <p className="mt-1 text-muted-foreground">Manage your blog posts</p>
          </div>
          <Button onClick={openCreate} className="shadow-sm">
            <Plus className="mr-2 h-4 w-4" /> New Post
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : !posts?.length ? (
          <div className="flex flex-col items-center rounded-xl border-2 border-dashed py-20">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <FileText className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-lg font-medium text-foreground">No posts yet</p>
            <p className="mt-1 text-sm text-muted-foreground">Create your first post to get started</p>
            <Button className="mt-6" onClick={openCreate}><Plus className="mr-2 h-4 w-4" /> Create Post</Button>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                showActions
                onEdit={() => openEdit(post)}
                onDelete={() => deletePost.mutate(post.id)}
              />
            ))}
          </div>
        )}

        <Dialog open={editorOpen} onOpenChange={setEditorOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">{editingPost ? 'Edit Post' : 'Create New Post'}</DialogTitle>
            </DialogHeader>
            <PostEditor
              initialData={editingPost ? { title: editingPost.title, content: editingPost.content, excerpt: editingPost.excerpt ?? '', published: editingPost.published } : undefined}
              onSave={handleSave}
              saving={createPost.isPending || updatePost.isPending}
            />
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
