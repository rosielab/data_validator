//Pssible question types
//May be expanded as addional question types are required

export interface Bubble {
    question_name: string;
    choice_list: Array<object>;
    required: boolean;
    handleChange(event: React.ChangeEvent<HTMLInputElement>, input: string): void;
    value: string;
    question_id: string;
}

export interface Checkbox {
    question_name: string;
    choice_list: Array<object>;
    required: boolean;
    handleChange(event: React.ChangeEvent<HTMLInputElement>, input: string): void;
}

export interface Ranking {
    question_name: string;
    top_choice_label: string;
    bottom_choice_label: string;
    required: boolean;
    handleChange(event: React.ChangeEvent<HTMLInputElement>, input: string): void;
    value: Object;
    questionid: string;
}

export interface Shorttext {
    question_name: string;
    required: boolean;
    handleChange(event: React.ChangeEvent<HTMLInputElement>, input: string): void;
}

export interface Longtext {
    question_name: string;
    required: boolean,
    handleChange(event: React.ChangeEvent<HTMLInputElement>, input: string): void;
}

export interface Slide {
    question_name: string;
    left_label: string;
    right_label: string;
    num_ticks: number;
    required: boolean;
    handleChange(event: Event, value: number | number[], activeThumb: number): void;
    value: number;
    question_id: string;
}
