interface SectionTitleProps {
  title: string;
  showViewAll?: boolean;
}

const SectionTitle = ({ title }: SectionTitleProps) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
    </div>
  );
};

export default SectionTitle;
