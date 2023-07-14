import { notification } from "antd";

const useNotification = () => {
  type NotificationType = "success" | "info" | "warning" | "error";

  interface Notification {
    type: NotificationType;
    title: string;
    description: string;
  }
  const [api, contextHolder] = notification.useNotification();

  const openNotificationWithIcon = ({
    type,
    title,
    description,
  }: Notification) => {
    api[type]({
      message: title,
      description: description,
    });
  };
  return { openNotificationWithIcon, contextHolder };
};

export default useNotification;
