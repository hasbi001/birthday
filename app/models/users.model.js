module.exports = mongoose => {
    var schema = mongoose.Schema(
      {
        id: String,
        fullname: String,
        birthdate: { type: Date, default: Date.now },
        phonenumber: Number,
        address : String
      },
      { timestamps: true }
    );
    
    schema.method("toJSON", function() {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });
    const User = mongoose.model("user", schema);
    return User;
  };