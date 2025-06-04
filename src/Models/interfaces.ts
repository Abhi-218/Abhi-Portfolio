
export interface IUser{
  _id : string;
  name : string;
  email : string;
  profileImage : string;
  role: string;
}

export interface IUserWithSuccess {
  user: IUser;
  success: boolean;
}


export interface IComment {
  _id: string;
  email: string;
  text: string;
  createdAt: string;
}

export interface ICommentBoxProps {
  id: string;
  comments: IComment[];
  onUpdate: (updated: ISuggestion) => void;
}


export interface ISuggestion {
  _id: string;            
  user: IUser;   
  message: string;        
  likes: string[];        
  dislikes: string[];     
  comments: IComment[];  // Add any other properties you have in your suggestion objects,
}

export interface ISuggestionCardProps {
  suggestion: ISuggestion;
  currentUser?: IUser;
  onUpdate: (updated: ISuggestion) => void;
}