'use client';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/_components/ui/tabs';
import DraftContent from './DraftContent';
import SaleContent from './SaleContent';

const SalesTab = () => {
  return (
    <div>
      <Tabs defaultValue="sale" className="w-full h-[560px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger
            className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b data-[state=active]:border-gray-700 data-[state=active]:rounded-none"
            value="sale"
          >
            Sale
          </TabsTrigger>
          <TabsTrigger
            className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b data-[state=active]:border-gray-700 data-[state=active]:rounded-none"
            value="draft"
          >
            Draft
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sale">
          <SaleContent />
        </TabsContent>
        <TabsContent value="draft">
          <DraftContent />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SalesTab;
