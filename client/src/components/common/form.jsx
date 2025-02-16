import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";

function CommonForm({
  formControls,
  formData,
  setFormData,
  onSubmit,
  buttonText,
  isBtnDisabled
}) {
  function renderInputsByComponentType(getControlItem) {
    let element = null;
    const value = formData[getControlItem?.name || ""];
    switch (getControlItem.componentType) {
      case "input":
        element = (
          <Input
            name={getControlItem?.name}
            placeholder={getControlItem?.placeholder}
            id={getControlItem?.name}
            type={getControlItem?.type}
            value={value}
            onChange={(e) =>
              setFormData({
                ...formData,
                [getControlItem.name]: e.target.value
              })
            }
          />
        );
        break;

      case "select":
        element = (
          <Select
            onValueChange={(value) =>
              setFormData({ ...formData, [getControlItem.name]: value })
            }
            value={value}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={getControlItem?.label} />
            </SelectTrigger>
            <SelectContent>
              {getControlItem?.options &&
                getControlItem?.options?.length > 0 &&
                getControlItem?.options.map((optionItem) => (
                  <SelectItem value={optionItem?.id} key={optionItem?.id}>
                    {optionItem?.label}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        );
        break;

      case "textarea":
        element = (
          <Textarea
            name={getControlItem?.name}
            id={getControlItem?.id}
            placeholder={getControlItem?.placeholder}
            value={value}
            onChange={(e) =>
              setFormData({
                ...formData,
                [getControlItem.name]: e.target.value
              })
            }
          />
        );
        break;

      default:
        element = (
          <Input
            name={getControlItem?.name}
            placeholder={getControlItem?.placeholder}
            id={getControlItem?.name}
            type={getControlItem?.type}
          />
        );
        break;
    }

    return element;
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="flex flex-col gap-3">
        {formControls.map((controlItem) => (
          <div className="grid w-full gap-1.5" key={controlItem?.name}>
            <Label className="mb-1">{controlItem?.label}</Label>
            {renderInputsByComponentType(controlItem)}
          </div>
        ))}
      </div>
      <Button className="mt-2 w-full" type="submit" disabled={isBtnDisabled}>
        {buttonText || "Submit"}
      </Button>
    </form>
  );
}

export default CommonForm;
