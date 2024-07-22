export interface ILCManswer {
  error: boolean;
  data: IProducts[];
}

export interface IProducts {
  cod_fact: string;
  name: string;
  name_complete: string;
  synonym: string;
  type: string;
  price: number;
  discount: boolean;
  test_type: TestType;
  recommendations: any[];
}

export interface TestType {
  id: number;
  description: string;
}
