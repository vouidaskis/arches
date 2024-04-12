import arches from "arches";
import Cookies from "js-cookie";

import Toast from "primevue/toast";
import type {
    ControlledList,
    ControlledListItem,
    Label,
    NewLabel,
} from "@/types/ControlledListManager";

const ERROR = "error";
type GetText = (s: string) => string;

export const postItemToServer = async (
    item: ControlledListItem,
    toast: typeof Toast,
    $gettext: GetText
) => {
    let errorText;
    try {
        const response = await fetch(
            arches.urls.controlled_list_item(item.id),
            {
                method: "POST",
                headers: {
                    "X-CSRFToken": Cookies.get("csrftoken"),
                },
                body: JSON.stringify(item),
            }
        );
        if (!response.ok) {
            errorText = response.statusText;
            const body = await response.json();
            errorText = body.message;
            throw new Error();
        } else {
            return await response.json();
        }
    } catch {
        toast.add({
            severity: ERROR,
            summary: errorText || $gettext("Save failed"),
        });
    }
};

export const postListToServer = async (
    list: ControlledList,
    toast: typeof Toast,
    $gettext: GetText
) => {
    let errorText;
    try {
        const response = await fetch(arches.urls.controlled_list(list.id), {
            method: "POST",
            headers: {
                "X-CSRFToken": Cookies.get("csrftoken"),
            },
            body: JSON.stringify(list),
        });
        if (!response.ok) {
            errorText = response.statusText;
            const body = await response.json();
            errorText = body.message;
            throw new Error();
        } else {
            return await response.json();
        }
    } catch {
        toast.add({
            severity: ERROR,
            summary: errorText || $gettext("Save failed"),
        });
    }
};

export const upsertLabel = async (
    label: NewLabel,
    toast: typeof Toast,
    $gettext: GetText
) => {
    let errorText;
    const url = label.id
        ? arches.urls.controlled_list_item_label(label.id)
        : arches.urls.controlled_list_item_label_add;
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "X-CSRFToken": Cookies.get("csrftoken"),
            },
            body: JSON.stringify(label),
        });
        if (!response.ok) {
            errorText = response.statusText;
            const body = await response.json();
            errorText = body.message;
            throw new Error();
        } else {
            return await response.json();
        }
    } catch {
        toast.add({
            severity: ERROR,
            summary: errorText || $gettext("Label save failed"),
        });
    }
};

export const deleteLabel = async (
    label: Label,
    toast: typeof Toast,
    $gettext: GetText
) => {
    let errorText;
    try {
        const response = await fetch(
            arches.urls.controlled_list_item_label(label.id),
            {
                method: "DELETE",
                headers: {
                    "X-CSRFToken": Cookies.get("csrftoken"),
                },
            }
        );
        if (!response.ok) {
            errorText = response.statusText;
            const body = await response.json();
            errorText = body.message;
            throw new Error();
        } else {
            return true;
        }
    } catch {
        toast.add({
            severity: ERROR,
            summary: errorText || $gettext("Label deletion failed"),
        });
    }
};
