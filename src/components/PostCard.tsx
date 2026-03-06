import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { Sparkles, ArrowUpRight } from 'lucide-react';
import type { Post } from '@/hooks/usePosts';

interface Props {
  post: Post;
  showActions?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function PostCard({ post, showActions, onEdit, onDelete }: Props) {
  return (
    <Card className="group relative overflow-hidden transition-all duration-200 hover:shadow-md hover:border-primary/20 hover:-translate-y-0.5">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-3">
          <Link
            to={`/post/${post.id}`}
            className="text-lg font-semibold leading-snug tracking-tight text-foreground transition-colors group-hover:text-primary"
          >
            {post.title}
          </Link>
          <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
        </div>
        <div className="mt-2 flex items-center gap-1.5">
          {post.ai_generated && (
            <Badge variant="secondary" className="gap-1 text-xs font-medium text-primary">
              <Sparkles className="h-3 w-3" /> AI
            </Badge>
          )}
          <Badge variant={post.published ? 'default' : 'outline'} className="text-xs">
            {post.published ? 'Published' : 'Draft'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {post.excerpt || post.content.slice(0, 150)}
        </p>
        <div className="mt-4 flex items-center justify-between border-t pt-3">
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
          </span>
          {showActions && (
            <div className="flex gap-3">
              <button onClick={onEdit} className="text-xs font-medium text-primary hover:underline">Edit</button>
              <button onClick={onDelete} className="text-xs font-medium text-destructive hover:underline">Delete</button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
