import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our articles table
export interface Article {
    id: string;
    original_title: string;
    rewritten_title: string | null;
    original_url: string;
    source_domain: string;
    raw_content: string | null;
    summary_content: string | null;
    image_url: string | null;
    published_at: string;
    created_at: string;
}

export interface ArticleInsert {
    original_title: string;
    rewritten_title?: string;
    original_url: string;
    source_domain: string;
    raw_content?: string;
    summary_content?: string;
    image_url?: string;
    published_at: string;
}
