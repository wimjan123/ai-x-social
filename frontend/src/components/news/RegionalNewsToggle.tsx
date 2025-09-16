'use client';

import { useState, useCallback } from 'react';
import { cn } from '@/lib/design-system';
import { Globe, MapPin, ChevronDown, Check, Clock } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface RegionalNewsToggleProps {
  currentRegion: string;
  onRegionChange: (region: string) => void;
  className?: string;
  variant?: 'default' | 'compact' | 'minimal';
  showLabel?: boolean;
}

interface Region {
  code: string;
  name: string;
  flag: string;
  description: string;
  timezone?: string;
  languages?: string[];
}

const regions: Region[] = [
  {
    code: 'WORLDWIDE',
    name: 'Worldwide',
    flag: '🌍',
    description: 'Global news from all regions',
    languages: ['en'],
  },
  {
    code: 'US',
    name: 'United States',
    flag: '🇺🇸',
    description: 'News focused on the United States',
    timezone: 'America/New_York',
    languages: ['en'],
  },
  {
    code: 'UK',
    name: 'United Kingdom',
    flag: '🇬🇧',
    description: 'News from the United Kingdom and Britain',
    timezone: 'Europe/London',
    languages: ['en'],
  },
  {
    code: 'CA',
    name: 'Canada',
    flag: '🇨🇦',
    description: 'Canadian news and updates',
    timezone: 'America/Toronto',
    languages: ['en', 'fr'],
  },
  {
    code: 'AU',
    name: 'Australia',
    flag: '🇦🇺',
    description: 'News from Australia and Oceania',
    timezone: 'Australia/Sydney',
    languages: ['en'],
  },
  {
    code: 'EU',
    name: 'Europe',
    flag: '🇪🇺',
    description: 'European Union and European news',
    timezone: 'Europe/Brussels',
    languages: ['en', 'de', 'fr', 'es', 'it'],
  },
  {
    code: 'AS',
    name: 'Asia',
    flag: '🌏',
    description: 'News from Asian countries and regions',
    languages: ['en', 'zh', 'ja', 'ko'],
  },
  {
    code: 'AF',
    name: 'Africa',
    flag: '🌍',
    description: 'African news and developments',
    languages: ['en', 'fr', 'ar'],
  },
  {
    code: 'SA',
    name: 'South America',
    flag: '🌎',
    description: 'News from South American countries',
    languages: ['es', 'pt', 'en'],
  },
];

function RegionOption({ 
  region, 
  isSelected, 
  onClick, 
  variant 
}: { 
  region: Region; 
  isSelected: boolean; 
  onClick: () => void;
  variant: string;
}) {
  if (variant === 'minimal') {
    return (
      <button
        onClick={onClick}
        className={cn(
          'flex items-center space-x-2 px-3 py-2 rounded-lg text-left',
          'hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors',
          isSelected && 'bg-x-blue text-white hover:bg-x-blue-hover'
        )}
      >
        <span className="text-lg">{region.flag}</span>
        <span className="text-sm font-medium">{region.name}</span>
        {isSelected && <Check className="w-4 h-4 ml-auto" />}
      </button>
    );
  }
  
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center justify-between p-3 text-left',
        'hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors',
        'border-b border-gray-100 dark:border-gray-700 last:border-b-0',
        isSelected && 'bg-x-blue text-white hover:bg-x-blue-hover'
      )}
    >
      <div className="flex items-center space-x-3">
        <span className="text-2xl">{region.flag}</span>
        <div className="flex-1">
          <div className="font-medium">{region.name}</div>
          {variant === 'default' && (
            <div className={cn(
              'text-sm',
              isSelected ? 'text-blue-100' : 'text-x-text-secondary dark:text-x-text-secondary-dark'
            )}>
              {region.description}
            </div>
          )}
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        {region.languages && variant === 'default' && (
          <div className="flex space-x-1">
            {region.languages.slice(0, 3).map((lang) => (
              <span
                key={lang}
                className={cn(
                  'px-2 py-1 rounded text-xs font-medium',
                  isSelected
                    ? 'bg-blue-600 text-blue-100'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                )}
              >
                {lang.toUpperCase()}
              </span>
            ))}
          </div>
        )}
        {isSelected && <Check className="w-5 h-5" />}
      </div>
    </button>
  );
}

function RegionDropdown({
  regions,
  currentRegion,
  onSelect,
  isOpen,
  onToggle,
  variant,
}: {
  regions: Region[];
  currentRegion: string;
  onSelect: (region: string) => void;
  isOpen: boolean;
  onToggle: () => void;
  variant: string;
}) {
  const selectedRegion = regions.find(r => r.code === currentRegion) || regions[0];
  
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className={cn(
          'flex items-center justify-between w-full px-4 py-2',
          'bg-white dark:bg-x-dark border border-x-border rounded-lg',
          'hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-x-blue focus:ring-offset-2',
          isOpen && 'ring-2 ring-x-blue ring-offset-2'
        )}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label="Select news region"
      >
        <div className="flex items-center space-x-3">
          <span className="text-lg">{selectedRegion.flag}</span>
          <div className="text-left">
            <div className="font-medium text-x-text dark:text-x-text-dark">
              {selectedRegion.name}
            </div>
            {variant === 'default' && (
              <div className="text-xs text-x-text-secondary dark:text-x-text-secondary-dark">
                {selectedRegion.description}
              </div>
            )}
          </div>
        </div>
        <ChevronDown className={cn(
          'w-4 h-4 text-x-text-secondary dark:text-x-text-secondary-dark transition-transform',
          isOpen && 'transform rotate-180'
        )} />
      </button>
      
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={onToggle}
          />
          
          {/* Dropdown */}
          <div className={cn(
            'absolute top-full left-0 right-0 z-20 mt-1',
            'bg-white dark:bg-x-dark border border-x-border rounded-lg shadow-lg',
            'max-h-96 overflow-y-auto'
          )}>
            {regions.map((region) => (
              <RegionOption
                key={region.code}
                region={region}
                isSelected={region.code === currentRegion}
                onClick={() => {
                  onSelect(region.code);
                  onToggle();
                }}
                variant={variant}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function RegionTabs({
  regions,
  currentRegion,
  onSelect,
}: {
  regions: Region[];
  currentRegion: string;
  onSelect: (region: string) => void;
}) {
  return (
    <div className="flex space-x-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-x-auto">
      {regions.slice(0, 6).map((region) => {
        const isSelected = region.code === currentRegion;
        return (
          <button
            key={region.code}
            onClick={() => onSelect(region.code)}
            className={cn(
              'flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium',
              'whitespace-nowrap transition-all duration-200',
              isSelected
                ? 'bg-white dark:bg-x-dark text-x-text dark:text-x-text-dark shadow-sm'
                : 'text-x-text-secondary dark:text-x-text-secondary-dark hover:text-x-text dark:hover:text-x-text-dark'
            )}
          >
            <span>{region.flag}</span>
            <span>{region.name}</span>
          </button>
        );
      })}
    </div>
  );
}

export function RegionalNewsToggle({
  currentRegion,
  onRegionChange,
  className,
  variant = 'default',
  showLabel = true,
}: RegionalNewsToggleProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const handleRegionSelect = useCallback((regionCode: string) => {
    onRegionChange(regionCode);
    setIsOpen(false);
  }, [onRegionChange]);
  
  const toggleDropdown = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);
  
  if (variant === 'minimal') {
    const selectedRegion = regions.find(r => r.code === currentRegion) || regions[0];
    
    return (
      <div className={cn('flex items-center space-x-2', className)}>
        {showLabel && (
          <div className="flex items-center space-x-1 text-sm text-x-text-secondary dark:text-x-text-secondary-dark">
            <MapPin className="w-4 h-4" />
            <span>Region:</span>
          </div>
        )}
        
        <div className="flex items-center space-x-2 px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full">
          <span>{selectedRegion.flag}</span>
          <span className="text-sm font-medium text-x-text dark:text-x-text-dark">
            {selectedRegion.name}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleDropdown}
            className="h-6 w-6 p-0"
          >
            <ChevronDown className="w-3 h-3" />
          </Button>
        </div>
        
        {isOpen && (
          <RegionDropdown
            regions={regions}
            currentRegion={currentRegion}
            onSelect={handleRegionSelect}
            isOpen={isOpen}
            onToggle={toggleDropdown}
            variant={variant}
          />
        )}
      </div>
    );
  }
  
  if (variant === 'compact') {
    return (
      <div className={cn('space-y-2', className)}>
        {showLabel && (
          <div className="flex items-center space-x-2 text-sm font-medium text-x-text dark:text-x-text-dark">
            <Globe className="w-4 h-4" />
            <span>News Region</span>
          </div>
        )}
        
        <RegionTabs
          regions={regions}
          currentRegion={currentRegion}
          onSelect={handleRegionSelect}
        />
      </div>
    );
  }
  
  // Default variant
  return (
    <div className={cn('space-y-3', className)}>
      {showLabel && (
        <div className="flex items-center space-x-2">
          <Globe className="w-5 h-5 text-x-blue" />
          <h3 className="font-medium text-x-text dark:text-x-text-dark">
            Select News Region
          </h3>
        </div>
      )}
      
      <RegionDropdown
        regions={regions}
        currentRegion={currentRegion}
        onSelect={handleRegionSelect}
        isOpen={isOpen}
        onToggle={toggleDropdown}
        variant={variant}
      />
      
      {/* Quick Access Buttons */}
      <div className="flex flex-wrap gap-2">
        {regions.slice(0, 4).map((region) => {
          const isSelected = region.code === currentRegion;
          return (
            <Button
              key={region.code}
              variant={isSelected ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleRegionSelect(region.code)}
              className="flex items-center space-x-2"
            >
              <span>{region.flag}</span>
              <span>{region.name}</span>
            </Button>
          );
        })}
      </div>
      
      {/* Region Info */}
      {(() => {
        const selectedRegion = regions.find(r => r.code === currentRegion);
        if (!selectedRegion || selectedRegion.code === 'WORLDWIDE') return null;
        
        return (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
            <div className="flex items-start space-x-3">
              <span className="text-2xl">{selectedRegion.flag}</span>
              <div className="flex-1">
                <div className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                  {selectedRegion.name} News
                </div>
                <div className="text-sm text-blue-700 dark:text-blue-300 mb-2">
                  {selectedRegion.description}
                </div>
                <div className="flex items-center space-x-4 text-xs text-blue-600 dark:text-blue-400">
                  {selectedRegion.timezone && (
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{selectedRegion.timezone}</span>
                    </div>
                  )}
                  {selectedRegion.languages && (
                    <div className="flex items-center space-x-1">
                      <Globe className="w-3 h-3" />
                      <span>{selectedRegion.languages.join(', ').toUpperCase()}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })()
      }
    </div>
  );
}