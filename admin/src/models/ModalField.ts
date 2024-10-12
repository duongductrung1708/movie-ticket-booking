interface BaseField {
    label: string;
    name: string;
    type: string;
}

interface SimpleField extends BaseField {
    options?: undefined; // This field is optional and undefined
}

interface SelectField extends BaseField {
    options: { label: string; value: string }[]; // Array of option objects
}