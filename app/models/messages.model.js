module.exports = mongoose => {
    var schema = mongoose.Schema(
      {
        id: String,
        message: String,
        duedate: { type: Date, default: Date.now },
        status: { type: Number, default: 0 }
      },
      { timestamps: true }
    );
    
    schema.method("toJSON", function() {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });
    const Message = mongoose.model("message", schema);
    return Message;
  };