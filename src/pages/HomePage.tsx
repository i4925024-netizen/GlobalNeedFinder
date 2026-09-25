import React from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { CategoryGrid } from '../components/home/CategoryGrid';
import { HowItWorksSection } from '../components/home/HowItWorksSection';
import { FeaturedNeeds } from '../components/home/FeaturedNeeds';
import { CtaBanners } from '../components/home/CtaBanners';

interface HomePageProps {
  navigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ navigate }) => {
  const handleHeroSearch = (query: string, country: string) => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (country && country !== 'all') params.set('country', country);
    navigate(`/search?${params.toString()}`);
  };

  const handleSelectCategory = (slug: string) => {
    if (slug === 'all') {
      navigate('/categories');
    } else {
      navigate(`/category/${slug}`);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection onSearch={handleHeroSearch} navigate={navigate} />
      <CategoryGrid onSelectCategory={handleSelectCategory} />
      <FeaturedNeeds navigate={navigate} />
      <HowItWorksSection />
      <CtaBanners navigate={navigate} />
    </div>
  );
};
