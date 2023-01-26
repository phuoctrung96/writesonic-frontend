import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { updateOrderOfProduct } from "../../../../../api/admin/credit";
import { SubscriptionProduct } from "../../../../../api/credit_v2";
import RenderPrices from "./renderPrices";

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isDragging ? "rgb(224, 231, 255)" : "#fff",
  borderRadius: "0.3rem",
  boxShadow: "1px 1px 1px 1px rgba(0, 0, 0, 0.05)",
  position: "relative",

  // styles we need to apply on draggables
  ...draggableStyle,
});

const reorder = (list, startIndex, endIndex): SubscriptionProduct[] => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result as SubscriptionProduct[];
};

const DraggablePlans: React.FC<{ plans: SubscriptionProduct[] }> = ({
  plans,
}) => {
  const [products, setProducts] = useState<SubscriptionProduct[]>([]);
  const router = useRouter();
  const { locale } = router;

  useEffect(() => {
    setProducts(plans);
  }, [plans]);

  const onDragEnd = async (result) => {
    if (!result.destination) {
      return;
    }

    // dropped outside the list
    const newItems = reorder(
      products,
      result.source.index,
      result.destination.index
    );
    setProducts(newItems);
    const data = newItems.map(({ id }, index) => {
      return {
        product_id: id,
        order: index,
      };
    });
    try {
      await updateOrderOfProduct(data);
    } catch (err) {
    } finally {
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable">
        {(provided, snapshot) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {products?.map(({ id, name, description, plans }, index) => (
              <Draggable key={id} draggableId={id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={getItemStyle(
                      snapshot.isDragging,
                      provided.draggableProps.style
                    )}
                    className="grid grid-cols-3 gap-x-2 place-items-center"
                  >
                    <div className="text-indigo-900 ml-3 font-medium w-full">
                      {!!name && <span>{name[locale]}</span>}
                    </div>
                    <div className="text-indigo-700 ml-6 pl-1 text-sm md:ml-0 md:pl-0 md:text-left mr-auto">
                      {!!description &&
                        description[locale].map((val, index) => (
                          <p key={index}>{val}</p>
                        ))}
                    </div>
                    <div className="text-indigo-900 font-medium ml-auto">
                      <RenderPrices plans={plans} />
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default DraggablePlans;
