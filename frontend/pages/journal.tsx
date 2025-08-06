import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { 
  BookOpen, 
  Plus, 
  Search, 
  Calendar, 
  Filter, 
  Edit3, 
  Trash2, 
  Star,
  Tag,
  ArrowLeft,
  Save,
  X,
  Clock
} from 'lucide-react';

// Mock hook for now - replace with real implementation later
const useJournalEntriesMock = () => {
  const [entries, setEntries] = useState<Array<{
    id: string;
    title: string;
    content: string;
    tags: string[];
    createdAt: string;
    isPrivate: boolean;
  }>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createEntry = async (entry: any) => {
    console.log('Creating entry:', entry);
    setLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newEntry = {
      id: Math.random().toString(36).substr(2, 9),
      title: entry.title,
      content: entry.content,
      tags: entry.tags || [],
      createdAt: new Date().toISOString(),
      isPrivate: entry.isPrivate || false
    };
    
    setEntries(prev => [newEntry, ...prev]);
    setLoading(false);
  };

  const updateEntry = async (id: string, updatedEntry: any) => {
    console.log('Updating entry:', id, updatedEntry);
    setLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setEntries(prev => prev.map(entry => 
      entry.id === id 
        ? { ...entry, ...updatedEntry }
        : entry
    ));
    setLoading(false);
  };

  const deleteEntry = async (id: string) => {
    console.log('Deleting entry:', id);
    setLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    setEntries(prev => prev.filter(entry => entry.id !== id));
    setLoading(false);
  };

  return {
    entries,
    loading,
    error,
    createEntry,
    updateEntry,
    deleteEntry,
    isCreating: loading,
    isUpdating: loading,
    isDeleting: loading
  };
};

const JournalPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [editingEntry, setEditingEntry] = useState<any>(null);
  const [newEntry, setNewEntry] = useState({
    title: '',
    content: '',
    mood: 'good' as 'great' | 'good' | 'okay' | 'bad' | 'terrible',
    tags: '',
    learnings: '',
    challenges: '',
    achievements: '',
    isPrivate: false
  });

  const { 
    entries: journalEntries, 
    loading, 
    error, 
    createEntry, 
    updateEntry, 
    deleteEntry,
    isCreating: isCreatingEntry,
    isUpdating: isUpdatingEntry,
    isDeleting: isDeletingEntry
  } = useJournalEntriesMock();

  const handleCreateEntry = async () => {
    if (!newEntry.title.trim() || !newEntry.content.trim()) {
      return;
    }

    try {
      await createEntry({
        title: newEntry.title,
        content: newEntry.content,
        mood: newEntry.mood,
        tags: newEntry.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        learnings: newEntry.learnings.split(',').map(item => item.trim()).filter(item => item),
        challenges: newEntry.challenges.split(',').map(item => item.trim()).filter(item => item),
        achievements: newEntry.achievements.split(',').map(item => item.trim()).filter(item => item),
        isPrivate: newEntry.isPrivate
      });
      
      setNewEntry({
        title: '',
        content: '',
        mood: 'good',
        tags: '',
        learnings: '',
        challenges: '',
        achievements: '',
        isPrivate: false
      });
      setIsCreating(false);
    } catch (error) {
      console.error('Error creating entry:', error);
    }
  };

  const handleUpdateEntry = async () => {
    if (!editingEntry || !editingEntry.title.trim() || !editingEntry.content.trim()) {
      return;
    }

    try {
      await updateEntry(editingEntry.id, {
        title: editingEntry.title,
        content: editingEntry.content,
        mood: editingEntry.mood,
        tags: editingEntry.tags || [],
        learnings: editingEntry.learnings || [],
        challenges: editingEntry.challenges || [],
        achievements: editingEntry.achievements || [],
        isPrivate: editingEntry.isPrivate
      });
      
      setEditingEntry(null);
    } catch (error) {
      console.error('Error updating entry:', error);
    }
  };

  const handleDeleteEntry = async (entryId: string) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      try {
        await deleteEntry(entryId);
      } catch (error) {
        console.error('Error deleting entry:', error);
      }
    }
  };

  const filteredEntries = journalEntries.filter(entry => {
    const matchesSearch = entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = !selectedTag || (entry.tags && entry.tags.includes(selectedTag));
    return matchesSearch && matchesTag;
  });

  const allTags = [...new Set(journalEntries.flatMap(entry => entry.tags || []))];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Developer Journal</h1>
            <p className="text-muted-foreground">Document your coding journey and learnings</p>
          </div>
          <button
            onClick={() => setIsCreating(true)}
            className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Entry
          </button>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search entries..."
              className="w-full pl-10 pr-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <select
              className="px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground"
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
            >
              <option value="">All Tags</option>
              {allTags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Create/Edit Entry Modal */}
        {(isCreating || editingEntry) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-card rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-card-foreground">
                    {isCreating ? 'Create New Entry' : 'Edit Entry'}
                  </h2>
                  <button
                    onClick={() => {
                      setIsCreating(false);
                      setEditingEntry(null);
                    }}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-card-foreground mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground"
                      value={isCreating ? newEntry.title : editingEntry?.title || ''}
                      onChange={(e) => {
                        if (isCreating) {
                          setNewEntry(prev => ({ ...prev, title: e.target.value }));
                        } else {
                          setEditingEntry((prev: any) => ({ ...prev, title: e.target.value }));
                        }
                      }}
                      placeholder="Enter entry title..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-card-foreground mb-2">
                      Content
                    </label>
                    <textarea
                      rows={12}
                      className="w-full px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground"
                      value={isCreating ? newEntry.content : editingEntry?.content || ''}
                      onChange={(e) => {
                        if (isCreating) {
                          setNewEntry(prev => ({ ...prev, content: e.target.value }));
                        } else {
                          setEditingEntry((prev: any) => ({ ...prev, content: e.target.value }));
                        }
                      }}
                      placeholder="Share your thoughts, learnings, or challenges..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-card-foreground mb-2">
                      Tags (comma-separated)
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground"
                      value={isCreating ? newEntry.tags : editingEntry?.tags?.join(', ') || ''}
                      onChange={(e) => {
                        if (isCreating) {
                          setNewEntry(prev => ({ ...prev, tags: e.target.value }));
                        } else {
                          setEditingEntry((prev: any) => ({ ...prev, tags: e.target.value.split(',').map(tag => tag.trim()) }));
                        }
                      }}
                      placeholder="react, nodejs, debugging, learning..."
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="private"
                      className="h-4 w-4 text-primary border-input rounded focus:ring-ring"
                      checked={isCreating ? newEntry.isPrivate : editingEntry?.isPrivate || false}
                      onChange={(e) => {
                        if (isCreating) {
                          setNewEntry(prev => ({ ...prev, isPrivate: e.target.checked }));
                        } else {
                          setEditingEntry((prev: any) => ({ ...prev, isPrivate: e.target.checked }));
                        }
                      }}
                    />
                    <label htmlFor="private" className="ml-2 text-sm text-card-foreground">
                      Private entry (only visible to you)
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={() => {
                      setIsCreating(false);
                      setEditingEntry(null);
                    }}
                    className="px-4 py-2 border border-input rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={isCreating ? handleCreateEntry : handleUpdateEntry}
                    disabled={isCreatingEntry || isUpdatingEntry}
                    className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50"
                  >
                    {isCreatingEntry || isUpdatingEntry ? (
                      <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2"></div>
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    {isCreating ? 'Create Entry' : 'Update Entry'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Entries List */}
        <div className="grid gap-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground mt-4">Loading entries...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-destructive mb-4">Error loading entries</div>
              <p className="text-muted-foreground">{error.message}</p>
            </div>
          ) : filteredEntries.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No entries found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || selectedTag ? 'Try adjusting your filters' : 'Start documenting your coding journey'}
              </p>
              <button
                onClick={() => setIsCreating(true)}
                className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create First Entry
              </button>
            </div>
          ) : (
            filteredEntries.map((entry) => (
              <div key={entry.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{entry.title}</h3>
                      <div className="flex items-center text-sm text-gray-500 mb-3">
                        <Clock className="h-4 w-4 mr-1" />
                        {new Date(entry.createdAt).toLocaleDateString()}
                        {entry.isPrivate && (
                          <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                            Private
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingEntry(entry)}
                        className="p-2 text-gray-400 hover:text-blue-600"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteEntry(entry.id)}
                        className="p-2 text-gray-400 hover:text-red-600"
                        disabled={isDeletingEntry}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="prose max-w-none mb-4">
                    <p className="text-gray-700 line-clamp-3">{entry.content}</p>
                  </div>

                  {entry.tags && entry.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {entry.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
};

export default JournalPage;
