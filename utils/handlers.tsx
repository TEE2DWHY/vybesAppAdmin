import { User, Event } from "@/types";
import { deleteItem } from "@/utils/triggerAdminRequest";

export const handleDelete = async (
  endpoint: string,
  userId: string,
  componentName: string,
  fn: React.Dispatch<React.SetStateAction<boolean>>,
  messageApi: any
) => {
  try {
    await deleteItem(endpoint, userId);
    messageApi.success(
      <div className="font-[outfit] capitalize">
        {componentName} Deleted Successfully.
      </div>
    );
  } catch (error) {
    console.log(error);
  } finally {
    fn(false);
  }
};

export const showDeleteModalHandler = (
  id: string,
  setUserId: React.Dispatch<React.SetStateAction<string>>,
  setShowDeleteModalUser: React.Dispatch<React.SetStateAction<boolean>>
) => {
  setUserId(id);
  setShowDeleteModalUser(true);
};

export const showDeleteEventHandler = (
  id: string,
  setEventId: React.Dispatch<React.SetStateAction<string>>,
  setShowDeleteModalEvent: React.Dispatch<React.SetStateAction<boolean>>
) => {
  setEventId(id);
  setShowDeleteModalEvent(true);
};

export const handleShowUserModal = (
  user: User,
  setUser: React.Dispatch<React.SetStateAction<User | undefined>>,
  setShowUserModal: React.Dispatch<React.SetStateAction<boolean>>
) => {
  setUser(user);
  setShowUserModal(true);
};

export const handleShowEventModal = (
  event: Event,
  setEvent: React.Dispatch<React.SetStateAction<Event | undefined>>,
  setShowEventModal: React.Dispatch<React.SetStateAction<boolean>>
) => {
  console.log(event);
  setEvent(event);
  setShowEventModal(true);
};
