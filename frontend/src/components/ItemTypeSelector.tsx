import { useState } from 'react';
import { ItemType } from '../backend';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Gamepad2, Brain } from 'lucide-react';

interface ItemTypeSelectorProps {
  label: string;
  value: ItemType | null;
  onChange: (item: ItemType) => void;
}

export default function ItemTypeSelector({ label, value, onChange }: ItemTypeSelectorProps) {
  const [selectedType, setSelectedType] = useState<'robloxAccount' | 'brainrotItem'>(
    value?.__kind__ === 'robloxAccount' ? 'robloxAccount' : 'brainrotItem'
  );
  const [username, setUsername] = useState(
    value?.__kind__ === 'robloxAccount' ? value.robloxAccount.username : ''
  );
  const [level, setLevel] = useState(
    value?.__kind__ === 'robloxAccount' ? value.robloxAccount.level.toString() : ''
  );
  const [inventory, setInventory] = useState(
    value?.__kind__ === 'robloxAccount' ? value.robloxAccount.inventoryHighlights : ''
  );
  const [brainrotDesc, setBrainrotDesc] = useState(
    value?.__kind__ === 'brainrotItem' ? value.brainrotItem : ''
  );

  const handleTypeChange = (type: 'robloxAccount' | 'brainrotItem') => {
    setSelectedType(type);
    if (type === 'robloxAccount') {
      if (username) {
        onChange({
          __kind__: 'robloxAccount',
          robloxAccount: { username, level: BigInt(level || '0'), inventoryHighlights: inventory },
        });
      }
    } else {
      if (brainrotDesc) {
        onChange({ __kind__: 'brainrotItem', brainrotItem: brainrotDesc });
      }
    }
  };

  const handleRobloxChange = (u: string, l: string, inv: string) => {
    setUsername(u);
    setLevel(l);
    setInventory(inv);
    if (u) {
      onChange({
        __kind__: 'robloxAccount',
        robloxAccount: { username: u, level: BigInt(l || '0'), inventoryHighlights: inv },
      });
    }
  };

  const handleBrainrotChange = (desc: string) => {
    setBrainrotDesc(desc);
    if (desc) {
      onChange({ __kind__: 'brainrotItem', brainrotItem: desc });
    }
  };

  return (
    <div className="space-y-3">
      <Label className="text-sm font-black uppercase tracking-widest text-foreground">{label}</Label>

      {/* Type Toggle */}
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => handleTypeChange('robloxAccount')}
          className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 font-bold text-sm transition-all ${
            selectedType === 'robloxAccount'
              ? 'border-neon bg-neon/10 text-neon'
              : 'border-border text-muted-foreground hover:border-neon/40'
          }`}
        >
          <Gamepad2 size={16} />
          Roblox Account
        </button>
        <button
          type="button"
          onClick={() => handleTypeChange('brainrotItem')}
          className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 font-bold text-sm transition-all ${
            selectedType === 'brainrotItem'
              ? 'border-orange bg-orange/10 text-orange'
              : 'border-border text-muted-foreground hover:border-orange/40'
          }`}
        >
          <Brain size={16} />
          Brainrot Item
        </button>
      </div>

      {/* Fields */}
      {selectedType === 'robloxAccount' ? (
        <div className="space-y-3 p-4 rounded-lg border border-neon/20 bg-neon/5">
          <div>
            <Label className="text-xs font-bold text-neon uppercase tracking-wider mb-1 block">
              Roblox Username *
            </Label>
            <Input
              placeholder="e.g. CoolGamer123"
              value={username}
              onChange={(e) => handleRobloxChange(e.target.value, level, inventory)}
              className="border-neon/30 focus:border-neon bg-background"
            />
          </div>
          <div>
            <Label className="text-xs font-bold text-neon uppercase tracking-wider mb-1 block">
              Account Level
            </Label>
            <Input
              type="number"
              placeholder="e.g. 42"
              value={level}
              min="0"
              onChange={(e) => handleRobloxChange(username, e.target.value, inventory)}
              className="border-neon/30 focus:border-neon bg-background"
            />
          </div>
          <div>
            <Label className="text-xs font-bold text-neon uppercase tracking-wider mb-1 block">
              Inventory Highlights
            </Label>
            <Textarea
              placeholder="e.g. Dominus, Korblox, 10k Robux..."
              value={inventory}
              onChange={(e) => handleRobloxChange(username, level, e.target.value)}
              className="border-neon/30 focus:border-neon bg-background resize-none"
              rows={2}
            />
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-lg border border-orange/20 bg-orange/5">
          <Label className="text-xs font-bold text-orange uppercase tracking-wider mb-1 block">
            Brainrot Item Description *
          </Label>
          <Textarea
            placeholder="e.g. Skibidi Toilet Season 1 NFT, Sigma Male Grindset Pack, Ohio Rizz Bundle..."
            value={brainrotDesc}
            onChange={(e) => handleBrainrotChange(e.target.value)}
            className="border-orange/30 focus:border-orange bg-background resize-none"
            rows={3}
          />
        </div>
      )}
    </div>
  );
}
