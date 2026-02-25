import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useCreateListing } from '../hooks/useQueries';
import { ItemType } from '../backend';
import ItemTypeSelector from '../components/ItemTypeSelector';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRightLeft, Loader2, PlusCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function PostTradePage() {
  const navigate = useNavigate();
  const createListing = useCreateListing();

  const [displayName, setDisplayName] = useState('');
  const [offeredItem, setOfferedItem] = useState<ItemType | null>(null);
  const [requestedItem, setRequestedItem] = useState<ItemType | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!displayName.trim()) newErrors.displayName = 'Display name is required';
    if (!offeredItem) {
      newErrors.offeredItem = 'Please fill in what you are offering';
    } else if (offeredItem.__kind__ === 'robloxAccount' && !offeredItem.robloxAccount.username.trim()) {
      newErrors.offeredItem = 'Roblox username is required';
    } else if (offeredItem.__kind__ === 'brainrotItem' && !offeredItem.brainrotItem.trim()) {
      newErrors.offeredItem = 'Brainrot item description is required';
    }
    if (!requestedItem) {
      newErrors.requestedItem = 'Please fill in what you want';
    } else if (requestedItem.__kind__ === 'robloxAccount' && !requestedItem.robloxAccount.username.trim()) {
      newErrors.requestedItem = 'Roblox username is required';
    } else if (requestedItem.__kind__ === 'brainrotItem' && !requestedItem.brainrotItem.trim()) {
      newErrors.requestedItem = 'Brainrot item description is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (!offeredItem || !requestedItem) return;

    try {
      await createListing.mutateAsync({
        posterDisplayName: displayName.trim(),
        offeredItem,
        requestedItem,
      });
      toast.success('Trade posted! 🧠 Let the sigma grindset begin!');
      navigate({ to: '/' });
    } catch (err) {
      toast.error('Failed to post trade. Try again!');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="font-black text-4xl sm:text-5xl">
          POST A <span className="text-neon">TRADE</span>
        </h1>
        <p className="text-muted-foreground font-semibold">
          List your Roblox account or Brainrot item and find your perfect trade 🔥
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Display Name */}
        <Card className="border-2 border-border bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground">
              Your Info
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Label className="text-xs font-black uppercase tracking-widest mb-2 block">
                Display Name *
              </Label>
              <Input
                placeholder="e.g. SigmaTrader420"
                value={displayName}
                onChange={(e) => {
                  setDisplayName(e.target.value);
                  if (errors.displayName) setErrors((prev) => ({ ...prev, displayName: '' }));
                }}
                className={`font-bold ${errors.displayName ? 'border-destructive' : 'border-border focus:border-neon'}`}
              />
              {errors.displayName && (
                <p className="text-destructive text-xs mt-1 font-semibold">{errors.displayName}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Offering */}
        <Card className="border-2 border-neon/30 bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-black uppercase tracking-widest text-neon">
              What You're Offering
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ItemTypeSelector
              label=""
              value={offeredItem}
              onChange={(item) => {
                setOfferedItem(item);
                if (errors.offeredItem) setErrors((prev) => ({ ...prev, offeredItem: '' }));
              }}
            />
            {errors.offeredItem && (
              <p className="text-destructive text-xs mt-2 font-semibold">{errors.offeredItem}</p>
            )}
          </CardContent>
        </Card>

        {/* Arrow */}
        <div className="flex items-center justify-center">
          <div className="flex items-center gap-3 text-orange font-black text-sm uppercase tracking-widest">
            <div className="h-px w-16 bg-orange/30" />
            <ArrowRightLeft size={20} />
            <span>FOR</span>
            <ArrowRightLeft size={20} />
            <div className="h-px w-16 bg-orange/30" />
          </div>
        </div>

        {/* Requesting */}
        <Card className="border-2 border-orange/30 bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-black uppercase tracking-widest text-orange">
              What You Want
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ItemTypeSelector
              label=""
              value={requestedItem}
              onChange={(item) => {
                setRequestedItem(item);
                if (errors.requestedItem) setErrors((prev) => ({ ...prev, requestedItem: '' }));
              }}
            />
            {errors.requestedItem && (
              <p className="text-destructive text-xs mt-2 font-semibold">{errors.requestedItem}</p>
            )}
          </CardContent>
        </Card>

        {/* Submit */}
        <Button
          type="submit"
          disabled={createListing.isPending}
          className="w-full font-black text-lg py-6 bg-neon text-black hover:bg-neon/90 border-0 rounded-xl"
        >
          {createListing.isPending ? (
            <>
              <Loader2 size={20} className="mr-2 animate-spin" />
              POSTING...
            </>
          ) : (
            <>
              <PlusCircle size={20} className="mr-2" />
              POST TRADE 🧠
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
