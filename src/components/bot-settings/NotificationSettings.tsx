import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Mail, Phone, MessageSquare } from "lucide-react";

interface NotificationSettingsProps {
  email: string;
  phone: string;
  whatsapp: string;
  onEmailChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onWhatsappChange: (value: string) => void;
}

export function NotificationSettings({
  email,
  phone,
  whatsapp,
  onEmailChange,
  onPhoneChange,
  onWhatsappChange,
}: NotificationSettingsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Notification Settings</h3>
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email for Notifications
          </Label>
          <Input
            type="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            placeholder="Enter email address"
          />
        </div>
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            Phone for Deposit/Withdraw Alerts
          </Label>
          <Input
            type="tel"
            value={phone}
            onChange={(e) => onPhoneChange(e.target.value)}
            placeholder="Enter phone number"
          />
        </div>
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            WhatsApp for Daily Reports
          </Label>
          <Input
            type="tel"
            value={whatsapp}
            onChange={(e) => onWhatsappChange(e.target.value)}
            placeholder="Enter WhatsApp number"
          />
        </div>
      </div>
    </div>
  );
}